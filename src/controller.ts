'use strict';

import * as vscode from 'vscode';

export class PYQTController{
    private context:vscode.ExtensionContext;
    private cp = require('child_process');
    private fs = require('fs');
    private path = require('path');
    private _outputChannel: vscode.OutputChannel;

    constructor(context:vscode.ExtensionContext){
        this.context = context;
        this._outputChannel = vscode.window.createOutputChannel("PYQT");
    }

    private initFolder(filePath:string, {isRelativeToScript = false} = {}) {
        const sep = this.path.sep;
        const folderPath = filePath.replace(/(.*[\\\/]).*$/, "$1").replace(/[\\\/]/g, sep);

        const initDir = this.path.isAbsolute(folderPath) ? sep : '';
        const baseDir = isRelativeToScript ? __dirname : '.';
        folderPath.split(sep).reduce((parentDir:string, childDir:string) => {
            const curDir = this.path.resolve(baseDir, parentDir, childDir);
            try {
                if(!this.fs.existsSync(curDir)){
                    this.fs.mkdirSync(curDir);
                    this._outputChannel.appendLine(`[Info] Directory "${curDir}" created.`);
                }
            } catch (err) {
                if (err.code !== 'EEXIST') {
                    vscode.window.showErrorMessage(err.toString());
                    throw err;
                }
        
                //console.log(`Directory ${curDir} already exists!`);
            }
        
            return curDir;
        }, initDir);
    }

    private exec(cmd: string, successMessage="", stdoutPath: string = ""){
        //this._outputChannel.show(true);
        this._outputChannel.appendLine(`[Running] ${cmd}`);
        this.cp.exec(cmd, (err:any, stdout:any, stderr:any) => {
            if(stdout && stdoutPath){
                this.initFolder(stdoutPath);
                this.fs.writeFileSync(stdoutPath, stdout, 'utf8');
            }
            if (err) {
                this._outputChannel.appendLine(`[Error] ${stderr.toString()}`);
                vscode.window.showErrorMessage(err.toString());
                throw err;
            } else if(successMessage !== ""){
                this._outputChannel.appendLine(`[Done] ${successMessage}`);
                vscode.window.showInformationMessage(successMessage); 
            }
        });
    }

    private async getOrConfigDesignerPath() {
        let dPath = vscode.workspace.getConfiguration().get('pyqt-integration.qtdesigner.path', "");
        if(dPath === ""){
            vscode.window.showInformationMessage("Select your executable file of QT Designer");
            await vscode.window.showOpenDialog({
                canSelectMany: false
            }).then((uris: vscode.Uri[] | undefined) => {
                if(uris && uris.length !== 0){
                    vscode.workspace.getConfiguration().update('pyqt-integration.qtdesigner.path', uris[0].fsPath, vscode.ConfigurationTarget.Global);
                    dPath = uris[0].fsPath;
                }
            });
        }
        return dPath;
    }

    /**
     * createNewForm
     */
    public async createNewForm(fileUri: vscode.Uri) {
        const dPath =  await this.getOrConfigDesignerPath();
        if(dPath !== ""){
            this.exec(`"${dPath}"`);
        }
    }

    /**
     * editInDesigner
     */
    public async editInDesigner(fileUri: vscode.Uri) {
        const dPath =  await this.getOrConfigDesignerPath();
        if(dPath !== ""){
            this.exec(`"${dPath}" "${fileUri.fsPath}"`);
        }

    }

    /**
     * preview
     */
    public async preview(fileUri: vscode.Uri) {
        const pyuic = vscode.workspace.getConfiguration().get('pyqt-integration.pyuic.cmd', "");
        this.exec(`"${pyuic}" -p "${fileUri.fsPath}"`);
    }


    private resolvePath(fileUri: vscode.Uri, pyPath:string) : string {
        // path resolved
        let pyPathR = pyPath.replace("${ui_name}", "${name}").replace("${qrc_name}", "${name}");
        

        if(pyPathR.indexOf("${workspace}") !== -1){
            // Absolute path
            const workspaceFoldersList = vscode.workspace.workspaceFolders;
            let workspacePath = "";
            if(workspaceFoldersList && workspaceFoldersList.length !== 0){
                workspacePath = workspaceFoldersList[0].uri.fsPath;
            }

            let fileNameNoSuffix = fileUri.fsPath.replace(/(.*[\\\/])(.*)\..*$/, "$2");

            pyPathR = pyPathR.replace("${workspace}", workspacePath).replace("${name}", fileNameNoSuffix);

        } else {
            if(!this.path.isAbsolute(pyPathR)){
                let pattern = "$1" + pyPathR.replace("${name}", "$2");
                pyPathR = fileUri.fsPath.replace(/(.*[\\\/])(.*)\..*$/, pattern);
            } else {
                let fileNameNoSuffix = fileUri.fsPath.replace(/(.*[\\\/])(.*)\..*$/, "$2");
                pyPathR = pyPathR.replace("${name}", fileNameNoSuffix);
            }
        }

        return pyPathR;
    }

    /**
     * compileForm
     */
    public async compileForm(fileUri: vscode.Uri) {
        const pyuic = vscode.workspace.getConfiguration().get('pyqt-integration.pyuic.cmd', "");
        const pyPath = vscode.workspace.getConfiguration().get('pyqt-integration.pyuic.compile.filepath', "");

        // path resolved
        let pyPathR = this.resolvePath(fileUri, pyPath);

        this.initFolder(pyPathR);
        this.exec(`"${pyuic}" "${fileUri.fsPath}" -o "${pyPathR}"`, `Compiled to "${pyPathR}" successfully`);
    }

    /**
     * compileQRC
     */
    public async compileQRC(fileUri: vscode.Uri) {
        const pyrcc = vscode.workspace.getConfiguration().get('pyqt-integration.pyrcc.cmd', "");
        const pyPath = vscode.workspace.getConfiguration().get('pyqt-integration.pyrcc.compile.filepath', "");
        const addOpts = vscode.workspace.getConfiguration().get('pyqt-integration.pyrcc.compile.addOptions', "");

        // path resolved
        let pyPathR = this.resolvePath(fileUri, pyPath);

        this.initFolder(pyPathR);
        this.exec(`"${pyrcc}" "${fileUri.fsPath}" ${addOpts} -o "${pyPathR}"`, `Compiled to "${pyPathR}" successfully`);
    }

    /**
     * generateQRC
     * TODO
     */
    public generateQRC() {
    }
}