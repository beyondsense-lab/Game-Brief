export interface EmailProvider{send(to:string,subject:string,html:string):Promise<void>}
export const logProvider:EmailProvider={async send(to,subject){console.log('email queued',to,subject)}};
