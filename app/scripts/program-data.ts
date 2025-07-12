export const ProgramData = {
  getIcon: (program) => {
    const ICON_PATH = '../images/win98_icons/'
    switch (program) {
      case "msword":
        return `${ICON_PATH}WINWORD_2.ico`;
      case "notepad":
        return `${ICON_PATH}notepad_file.ico`;
      case "mail":
        return `${ICON_PATH}mail.ico`;
      case "minesweeper":
        return `${ICON_PATH}minesweeper.ico`;
      case "winamp":
        return `${ICON_PATH}winamp.ico`;
      case "wolf-3d":
        return `${ICON_PATH}wolf3d.ico`;
      case "iexplorer":
        return `${ICON_PATH}msie2.ico`;
      case "explorer":
        return `${ICON_PATH}hard_disk_drive.ico`;
      default:
        console.log('Don\'t have icon for this program');
        return `${ICON_PATH}msie2.ico`;
    }
  },
  getIconByType: (program) => {
    const ICON_PATH = '../images/win98_icons/'
    switch (program) {
      case "word":
      case "doc":
        return `${ICON_PATH}WINWORD_2.ico`;
      case "text":
      case "txt":
        return `${ICON_PATH}notepad_file.ico`;
      case "pdf":
        return `${ICON_PATH}pdf.png`;

      default:
        console.log('Don\'t have icon for this program');
    }
  }
}