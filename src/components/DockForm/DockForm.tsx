import { ReactNode } from "react";


export class CDockForm {

    constructor(public title: string, public children?: ReactNode, public icon?: ReactNode) {

    }

    public static Empty() {
        const form = new CDockForm('Empty Form');
        form.children = 'No Contents'
        form.icon = '';

        return form;
    }
}

const DockForm = ({ children, title, icon }: CDockForm) => {
    return (
        <div>
            {children}
        </div>
    )
}

export default DockForm;
