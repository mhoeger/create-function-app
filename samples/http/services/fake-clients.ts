// This would typically be from some other library
export class ExampleClient {
    getData() { return "Fake data fetched from fake service"; }
};

let _client: ExampleClient;

export function getExampleClient() {
    if (!_client) {
        _client = new ExampleClient();
    }
    return _client;
}