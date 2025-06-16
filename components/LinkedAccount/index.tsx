import * as React from "react";
import {useSupabaseSession} from "~/lib/Root/SupabaseSessionProvider";
import {WhileNotLinked} from "~/components/LinkedAccount/WhileNotLinked";
import {WhileLinked} from "~/components/LinkedAccount/WhileLinked";

export function LinkedAccount() {
    const session = useSupabaseSession();

    if (!session) return <WhileNotLinked/>
    return <WhileLinked email={session.user.email!}/>
}
