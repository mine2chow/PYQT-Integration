# PYQT Integration

[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version-short/zhoufeng.pyqt-integration.svg)](https://marketplace.visualstudio.com/items?itemName=zhoufeng.pyqt-integration) [![Extension Installs](https://vsmarketplacebadge.apphb.com/installs/zhoufeng.pyqt-integration.svg)](https://marketplace.visualstudio.com/items?itemName=zhoufeng.pyqt-integration) [![Extension Rating](https://vsmarketplacebadge.apphb.com/rating/zhoufeng.pyqt-integration.svg)](https://marketplace.visualstudio.com/items?itemName=zhoufeng.pyqt-integration)

An extension help you coding PYQT form in vsocde. Support "`.ui`", "`.qrc`" files.

![preview](./imgs/preview.png)

## Explorer context menu

|No.|Name|Description|
|:---:|---|---|
|1|PYQT: New Form|Open designer|
|2|PYQT: Edit In Designer|Open designer with current ui form|
|3|PYQT: Preview|Preview current ui form|
|4|PYQT: Compile Form|Compile ui form to path defined in "`pyqt-integration.pyuic.compile.filepath`"|
|5|PYQT: Compile Resource|Compile qrc file to path defined in "`pyqt-integration.pyrcc.compile.filepath`"|

## Properties

|No.|Name|Description|
|:---:|---|---|
|1|`pyqt-integration.qtdesigner.path`|Path of executable file of qt designer, the extension will ask you to set at the first time it runs, e.g. c:\\\\Users\\\\username\\\\AppData\\\\Local\\\\Programs\\\\Python\\\\Python35\\\\Lib\\\\site-packages\\\\pyqt5-tools\\\\designer.exe|
|2|`pyqt-integration.pyuic.cmd`|"pyuic" command, default "`pyuic5`"|
|3|`pyqt-integration.pyuic.compile.filepath`|Compile file path, relative path as default, switch to absolute path by involving ${workspace}, e.g. \${workspace}\\\\UI\\\\Ui_\${ui_name}.py|
|4|`pyqt-integration.pyrcc.cmd`|"pyrcc" command, default "`pyrcc5`"|
|5|`pyqt-integration.pyrcc.compile.filepath`|Compile file path, relative path as default, switch to absolute path by involving ${workspace}, e.g. \${workspace}\\\\QRC\\\\\${qrc_name}_rc.py|
|6|`pyqt-integration.pyrcc.compile.addOptions`|Additional options for pyrcc compiling, it can be a combination of '-root', '-threshold', '-compress', '-no-compress', etc.|

```text
Compilation will overwite the target py file without confirmation!
```