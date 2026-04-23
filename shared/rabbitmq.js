import amqp from "amqplib";

const EXCHANGE_NAME = "app.events";


export async function connectRabbitMQ() {
 try {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://rabbitmq:5672");

  const channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });

  console.log("[RabbitMQ] Connected and Exchange is ready.");
  return channel;
 } catch (error) {
  console.error("[RabbitMQ] Connection Error:", error.message);
  throw error;
 }
}


export async function publishMessage(channel, routingKey, payload) {
 try {
  const message = Buffer.from(JSON.stringify(payload));

  channel.publish(EXCHANGE_NAME, routingKey, message);

  console.log(`[RabbitMQ] Message published -> RoutingKey: ${routingKey}`);
 } catch (error) {
  console.error(`[RabbitMQ] Error publishing message to ${routingKey}:`, error.message);
 }
}


export async function consumeMessage(channel, queueName, routingKey, callback) {
 try {
  await channel.assertQueue(queueName, { durable: true });

  
  await channel.bindQueue(queueName, EXCHANGE_NAME, routingKey);

  console.log(`[RabbitMQ] Listening on queue "${queueName}" for routing key "${routingKey}"`);

  channel.consume(queueName, async (msg) => {
   if (!msg) return; 

   try {
    const data = JSON.parse(msg.content.toString());

    console.log(`[RabbitMQ] Message received -> RoutingKey: ${routingKey}`);

    await callback(data);

    channel.ack(msg);
   } catch (err) {
    console.error("[RabbitMQ] Error processing message in callback:", err.message);
    
   }
  });
 } catch (error) {
  console.error(`[RabbitMQ] Error setting up consumer for ${queueName}:`, error.message);
 }
}