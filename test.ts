// import { compileFromFile } from 'json-schema-to-typescript'
// import { writeFileSync } from 'fs'
 
// // compile from file
// compileFromFile('./create-config/schemas/host.schema.json')
//   .then(ts => writeFileSync('./create-config/schemas/host.d.ts', ts))


class QueueTrigger {
  public type: string = "queueTrigger";
  public direction: "in" = "in";
  public name: string;
  public queueName: string;
  public connection: string;
  constructor(queueName: string, connection: string, bindingName?: string) {
      this.queueName = queueName;
      this.connection = connection;
      this.name = bindingName || "queueTrigger";
  }
}

let t = new QueueTrigger("name", "connection");
console.log(JSON.stringify(t));