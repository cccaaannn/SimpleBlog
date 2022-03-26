import { Result, SuccessResult } from "../Results/Result";

interface Functions {
    function: Function,
    args: any[]
}

async function run(functions: Functions[]): Promise<Result> {
    for (let i = 0; i < functions.length; i++) {
        const res: Result = await functions[i].function(...functions[i].args);
        if (!res.status) {
            return res;
        }
    }
    return new SuccessResult();
}

export default run;
