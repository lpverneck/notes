import os
import shutil
from tqdm import tqdm
from pathlib import Path


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


if __name__ == "__main__":
    pvt_sb_dir, pub_sb_dir = get_directories_path()
    copy_public_notes(src_dir=pvt_sb_dir, target_dir=pub_sb_dir)
