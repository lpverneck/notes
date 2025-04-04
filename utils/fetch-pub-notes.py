import os
import regex as re
import shutil
from tqdm import tqdm
from pathlib import Path
from typing import List


ROOT_FOLDERS = [
    "01 Inbox",
    "02 Projects",
    "03 Areas",
    "04 Resources",
    "05 Archive",
]


def get_directories_path() -> tuple[str, str]:
    """Get the path of vault folders from environment variables."""

    pvt_sb_dir = os.getenv("SB")
    pub_sb_dir = os.getenv("SB_PUB")

    if pvt_sb_dir and pub_sb_dir:
        print("Path environment variables found !")
        return pvt_sb_dir, pub_sb_dir
    else:
        raise KeyError("Environment variable not found !")


def _is_note_public(note_path: Path) -> bool:
    """Given a note path, checks if the note is public or private."""

    with open(note_path, "r") as f:
        for _, line in list(enumerate(f, 1)):
            if "publish: true" in line:
                return True
        return False


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
    os.utime(
        target_dir, (src_datetime_info.st_atime, src_datetime_info.st_mtime)
    )


def copy_public_notes(src_dir: str, target_dir: str) -> None:
    """Selects the public notes in the source folder and copy them to the target
    folder."""

    all_notes = [x for x in Path(src_dir).rglob("*.md")]
    for file_path in tqdm(all_notes):
        parent_name = file_path.parent.name
        if parent_name != "Templates":
            if _is_note_public(file_path):
                if parent_name not in ROOT_FOLDERS:
                    target_parent_path = (
                        Path(target_dir) / "content" / parent_name
                    )
                    if not os.path.exists(target_parent_path):
                        os.mkdir(target_parent_path)
                    shutil.copy(file_path, target_parent_path / file_path.name)
                    _copy_file_modified_time(
                        src_dir=file_path,
                        target_dir=target_parent_path / file_path.name,
                    )


def copy_notes_attachments(src_dir: str, target_dir: str) -> None:
    """Copy the public notes attachments from the source folder to the target
    folder."""

    src_attachments_path = (
        Path(src_dir) / "04 Resources" / "Assets" / "Attachments"
    )
    target_notes_path = Path(target_dir) / "content"
    target_attachments_path = Path(target_dir) / "content" / "attachments"

    os.mkdir(target_attachments_path)

    all_pub_notes = [x for x in target_notes_path.rglob("*.md")]
    for file_path in tqdm(all_pub_notes):
        attachments_list = _search_for_attachments(note_path=file_path)
        if attachments_list:
            for item in attachments_list:
                shutil.copy(
                    src_attachments_path / item, target_attachments_path / item
                )


def replace_mermaid_diagram_custom_tags(
    target_dir: str, replacement: str = ""
):
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
                print(
                    f"Successfully replaced {count} occurrences in {file_path}."
                )
        except Exception as e:
            print(f"An error occurred: {e}")


if __name__ == "__main__":
    pvt_sb_dir, pub_sb_dir = get_directories_path()
    copy_public_notes(src_dir=pvt_sb_dir, target_dir=pub_sb_dir)
    copy_notes_attachments(src_dir=pvt_sb_dir, target_dir=pub_sb_dir)
    replace_mermaid_diagram_custom_tags(target_dir=pub_sb_dir)
