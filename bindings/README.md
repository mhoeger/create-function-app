# Bindings
Bindings should be produced and packaged and consumed in a re-composable way. The "core" bindings are those that come with extensionBundles. For other bindings (like RabbitMQ), a separate binding package should be created and consumed. 

All bindings for Azure Functions V2/V3 should be implemented based off of BaseBinding and other types in src/types.