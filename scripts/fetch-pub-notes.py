import os
import yaml
import shutil
import argparse
import regex as re
from tqdm import tqdm
from pathlib import Path
from typing import Any, List


# allow-list of root folders to ingest from the vault
ROOT_FOLDERS = [
    "Publishing",
]
REQUIRED_KEYS = ("title", "created at", "modified at", "status")
OPTIONAL_KEYS = ("status", "tags")
FRONTMATTER_RE = re.compile(r"\A---\r?\n(.*?)\r?\n---(?:\r?\n|\Z)", re.DOTALL)


def get_directories_path() -> tuple[str, str]:
    """Get the path of vault folders from environment variables."""

    pvt_sb_dir = os.getenv("SB")
    pub_sb_dir = os.getenv("SB_PUB")

    if pvt_sb_dir and pub_sb_dir:
        print("Path environment variables found !")
        return pvt_sb_dir, pub_sb_dir
    else:
        raise KeyError("Environment variable not found !")


def _validate_root_folders(src_path: Path) -> None:
    """Fail loudly when the allowed root folders are missing or unset, which would
    otherwise quietly publish nothing at all."""

    if not ROOT_FOLDERS:
        raise ValueError("ROOT_FOLDERS is empty, there is nothing to ingest !")

    missing = [name for name in ROOT_FOLDERS if not (src_path / name).is_dir()]
    if missing:
        raise FileNotFoundError(
            f"Root folder(s) not found in the vault: {', '.join(missing)}"
        )


def _read_frontmatter(note_path: Path) -> dict[str, Any] | None:
    """Given a note path, parse its leading YAML frontmatter block. Returns None
    when the note has no frontmatter or when the YAML is invalid."""

    try:
        content = note_path.read_text(encoding="utf-8")
    except OSError as e:
        tqdm.write(f"Could not read {note_path}: {e}")
        return None

    match = FRONTMATTER_RE.match(content)
    if match is None:
        return None

    try:
        data = yaml.safe_load(match.group(1))
    except yaml.YAMLError as e:
        tqdm.write(f"Invalid frontmatter in {note_path}: {e}")
        return None

    return data if isinstance(data, dict) else {}


def _is_note_public(frontmatter: dict[str, Any]) -> bool:
    """Given a note frontmatter, checks if the note is public or private. Reads
    only the frontmatter, so a `publish: true` inside the note body no longer
    publishes it, and accepts the boolean spellings YAML allows."""

    value = frontmatter.get("publish")

    if isinstance(value, bool):
        return value

    return isinstance(value, str) and value.strip().lower() == "true"


def _missing_template_keys(frontmatter: dict[str, Any]) -> List[str]:
    """Given a note frontmatter, return the template keys the note lacks."""

    return [key for key in REQUIRED_KEYS if key not in frontmatter]


def _empty_template_keys(frontmatter: dict[str, Any]) -> List[str]:
    """Given a note frontmatter, return the template keys left empty."""

    return [key for key in OPTIONAL_KEYS if key in frontmatter and not frontmatter[key]]


def _search_for_attachments(note_path: Path) -> List[str]:
    """Given a note path, search for attachments inside the note content and
    return a list of all found attachments."""

    attachments = []

    with open(note_path, "r", encoding="utf-8") as f:
        content = f.read()

    pattern = r"!\[\[(.*?)\]\]"
    matches = re.findall(pattern, content)

    for match in matches:
        attachments.append(match)

    attachments = list(set(attachments))

    return attachments


def _copy_file_modified_time(src_dir: str, target_dir: str) -> None:
    """Copy the access and modified datetime from the source note to the target
    one."""

    src_datetime_info = os.stat(src_dir)
    os.utime(target_dir, (src_datetime_info.st_atime, src_datetime_info.st_mtime))


def _report_selection(
    published: List[tuple[Path, Path]],
    outside: dict[str, int],
    legacy: List[tuple[Path, List[str]]],
    incomplete: List[tuple[Path, List[str]]],
    dry_run: bool,
) -> None:
    """Print what the selection decided about every note claiming to be public,
    so that a note silently missing from the site is debuggable."""

    print(f"\n{'Would publish' if dry_run else 'Published'} {len(published)} note(s):")
    for relative_path, destination in sorted(published):
        print(f"  {relative_path}  ->  content/{destination}")

    if incomplete:
        print(f"\nWarning, {len(incomplete)} published note(s) with empty keys:")
        for relative_path, keys in sorted(incomplete):
            print(f"  {relative_path}  (empty: {', '.join(keys)})")

    if legacy:
        print(f"\nRefused, {len(legacy)} note(s) outside the note template:")
        for relative_path, keys in sorted(legacy):
            print(f"  {relative_path}  (missing: {', '.join(keys)})")

    if outside:
        summary = ", ".join(f"{name} ({n})" for name, n in sorted(outside.items()))
        print(
            f"\nSkipped {sum(outside.values())} public note(s) outside "
            f"{', '.join(ROOT_FOLDERS)}: {summary}"
        )


def copy_public_notes(src_dir: str, target_dir: str, dry_run: bool = False) -> None:
    """Selects the public notes under the allowed root folders and copy them to
    the target folder, refusing any note that does not follow the current note
    template. The note lands in `content/<its immediate parent folder>/`, so the
    levels between the root folder and that parent are flattened away."""

    published: List[tuple[Path, Path]] = []
    outside: dict[str, int] = {}
    legacy: List[tuple[Path, List[str]]] = []
    incomplete: List[tuple[Path, List[str]]] = []

    src_path = Path(src_dir)
    _validate_root_folders(src_path)
    all_notes = [x for x in src_path.rglob("*.md")]

    for file_path in tqdm(all_notes):
        relative_path = file_path.relative_to(src_path)

        # Never walk into vault internals such as `.obsidian` or `.trash`.
        if any(part.startswith(".") for part in relative_path.parts):
            continue

        frontmatter = _read_frontmatter(file_path)
        if frontmatter is None or not _is_note_public(frontmatter):
            continue

        # A note sitting loose at the vault root has no root folder of its own.
        parts = relative_path.parts
        root_folder = parts[0] if len(parts) > 1 else "<vault root>"
        if root_folder not in ROOT_FOLDERS:
            outside[root_folder] = outside.get(root_folder, 0) + 1
            continue

        parent_name = file_path.parent.name

        missing_keys = _missing_template_keys(frontmatter)
        if missing_keys:
            legacy.append((relative_path, missing_keys))
            continue

        empty_keys = _empty_template_keys(frontmatter)
        if empty_keys:
            incomplete.append((relative_path, empty_keys))

        published.append((relative_path, Path(parent_name) / file_path.name))

        if dry_run:
            continue

        target_parent_path = Path(target_dir) / "content" / parent_name
        target_parent_path.mkdir(parents=True, exist_ok=True)
        shutil.copy(file_path, target_parent_path / file_path.name)
        _copy_file_modified_time(
            src_dir=file_path,
            target_dir=target_parent_path / file_path.name,
        )

    _report_selection(published, outside, legacy, incomplete, dry_run)


def copy_notes_attachments(src_dir: str, target_dir: str) -> None:
    """Copy the public notes attachments from the source folder to the target
    folder."""

    src_attachments_path = Path(src_dir) / "04 Resources" / "Assets" / "Attachments"
    target_notes_path = Path(target_dir) / "content"
    target_attachments_path = Path(target_dir) / "content" / "attachments"

    target_attachments_path.mkdir(parents=True, exist_ok=True)

    all_pub_notes = [x for x in target_notes_path.rglob("*.md")]
    for file_path in tqdm(all_pub_notes):
        attachments_list = _search_for_attachments(note_path=file_path)
        if attachments_list:
            for item in attachments_list:
                shutil.copy(src_attachments_path / item, target_attachments_path / item)


def replace_mermaid_diagram_custom_tags(target_dir: str, replacement: str = ""):
    """Replace text between %% markers in a markdown file and save the edited
    file."""

    target_notes_path = Path(target_dir) / "content"
    all_pub_notes = [x for x in target_notes_path.rglob("*.md")]

    for file_path in tqdm(all_pub_notes):
        try:
            with open(file_path, "r", encoding="utf-8") as file:
                content = file.read()

            # pattern = r'%%\s*(.*?)\s*%%'
            pattern = r'%%(?s).*?[\'"]theme[\'"]\s*:\s*[\'"]base[\'"].*?%%'
            updated_content, count = re.subn(pattern, replacement, content)

            with open(file_path, "w", encoding="utf-8") as file:
                file.write(updated_content)

            if count != 0:
                print(f"Successfully replaced {count} occurrences in {file_path}.")
        except Exception as e:
            print(f"An error occurred: {e}")


def drop_empty_frontmatter_keys(target_dir: str) -> None:
    """Remove the template keys a note left empty. They render as nothing on the
    site, so keeping them would make the published file disagree with the page."""

    target_notes_path = Path(target_dir) / "content"
    all_pub_notes = [x for x in target_notes_path.rglob("*.md")]

    for file_path in tqdm(all_pub_notes):
        frontmatter = _read_frontmatter(file_path)
        if not frontmatter:
            continue

        empty_keys = _empty_template_keys(frontmatter)
        if not empty_keys:
            continue

        try:
            content = file_path.read_text(encoding="utf-8")
            match = FRONTMATTER_RE.match(content)
            if match is None:
                continue

            keys_pattern = "|".join(re.escape(key) for key in empty_keys)
            drop_re = re.compile(rf"^({keys_pattern}):[ \t]*\r?$")
            block = "\n".join(
                line for line in match.group(1).split("\n") if not drop_re.match(line)
            )

            updated_content = (
                content[: match.start(1)] + block + content[match.end(1) :]
            )

            if updated_content != content:
                file_path.write_text(updated_content, encoding="utf-8")
                print(f"Successfully dropped {', '.join(empty_keys)} in {file_path}.")
        except Exception as e:
            print(f"An error occurred: {e}")


def normalize_frontmatter_spacing(target_dir: str) -> None:
    """Ensure exactly one blank line between the frontmatter closing '---' and
    the note content."""

    target_notes_path = Path(target_dir) / "content"
    all_pub_notes = [x for x in target_notes_path.rglob("*.md")]

    for file_path in tqdm(all_pub_notes):
        try:
            with open(file_path, "r", encoding="utf-8") as file:
                content = file.read()

            pattern = r"\A(---\r?\n.*?\r?\n---)[ \t]*\r?\n(?:[ \t]*\r?\n)*(?=\S)"
            updated_content = re.sub(pattern, r"\1\n\n", content, flags=re.DOTALL)

            if updated_content != content:
                with open(file_path, "w", encoding="utf-8") as file:
                    file.write(updated_content)
                print(f"Successfully normalized frontmatter spacing in {file_path}.")
        except Exception as e:
            print(f"An error occurred: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Copy the public Obsidian notes into the digital garden repository."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="report which notes would be published, without writing anything",
    )
    args = parser.parse_args()

    pvt_sb_dir, pub_sb_dir = get_directories_path()
    copy_public_notes(src_dir=pvt_sb_dir, target_dir=pub_sb_dir, dry_run=args.dry_run)

    if not args.dry_run:
        copy_notes_attachments(src_dir=pvt_sb_dir, target_dir=pub_sb_dir)
        replace_mermaid_diagram_custom_tags(target_dir=pub_sb_dir)
        drop_empty_frontmatter_keys(target_dir=pub_sb_dir)
        normalize_frontmatter_spacing(target_dir=pub_sb_dir)
