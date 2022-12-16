const typeDefs = `
  type Query {
    sensors: String
  }

  type SensorData {
    tem_panel: Float!
    tem_envi: Float!
    bucxa: Float!
    warning: Float!
  }

  type Subscription {
    subscribe2sensor: SensorData
  }

  schema {
    query: Query
    subscription: Subscription
  }
`;

module.exports = { typeDefs };
