import Command from '../entity/command.js';
import { connectRabbitMQ, publishMessage, consumeMessage } from 'shared';

// export const createCommand = async (req, res) => {
//  const { products, client_id, amount } = req.body;

//  try {


//   try {
//    clientResponse = await axios.get(`http://api_client:3000/api/clients/${client_id}`);
//   } catch (err) {

//    const status = err.response ? 404 : 503;
//    const msg = err.response ? "Client not found" : "Client service is unavailable";
//    return res.status(status).json({ message: msg });
//   }


//   try {
//    await Promise.all(
//     products.map(id => axios.get(`http://api_product:3000/api/products/${id}`))
//    );
//   } catch (prodError) {
//    const status = prodError.response ? 404 : 503;
//    const msg = prodError.response
//     ? "One or more products are not found in the inventory"
//     : "Product service is unavailable";
//    return res.status(status).json({
//     error: msg,
//     details: prodError.message
//    });
//   }


//   const command = new Command({
//    products,
//    client_id,
//    amount,
//    status: "Confirmed"
//   });

//   await command.save();
//   res.status(201).json({ message: "Command created successfully", data: command });

//  } catch (error) {

//   res.status(500).json({
//    message: "Internal Server Error in Command Service",
//    error: error.message
//   });
//  }
// };

export const getCommands = async (req, res) => {
 try {
  const commands = await Command.find();
  res.status(200).json(commands);
 } catch (error) {
  res.status(500).json({
   message: "Error fetching commands from database",
   error: error.message
  });
 }
};

export const deleteCommand = async (req, res) => {
 const { id } = req.params;
 try {
  const command = await Command.findByIdAndDelete(id);

  if (!command) {
   return res.status(404).json({ message: "Command not found" });
  }

  res.status(200).json({ message: "Command deleted successfully" });
 } catch (error) {
  res.status(500).json({
   message: "Error deleting command",
   error: error.message
  });
 }
};


export const createCommand = async (req, res) => {
 const { products, client_id } = req.body;

 try {
  const command = new Command({
   products,
   client_id,
   total_price: 0,
   status: "PENDING"
  });
  await command.save();

  const channel = await connectRabbitMQ();

  const message = {
   commandId: command._id,
   client_id,
   products
  };

  await publishMessage(channel, "order.validate", message);


  res.status(201).json({
   message: "La demande a été reçue et est en cours",
   data: command
  });
 } catch (error) {
  res.status(500).json({
   message: "Une erreur s'est produite lors de la création de la commande",
   error: error.message
  });
 }
}




export const listenToValidationResponses = async () => {
 try {
  const channel = await connectRabbitMQ();


  await consumeMessage(channel, 'order_response_queue', 'order.validated', async (data) => {

   const { commandId, isValid, errorMessage, totalAmount } = data;

   try {
    if (isValid) {
     await Command.findByIdAndUpdate(commandId, { status: "CONFIRMED", total_price: totalAmount });
     console.log(`[Database] Order ${commandId} CONFIRMED`);
    } else {
     await Command.findByIdAndUpdate(commandId, {
      status: "CANCELLED",
      notes: errorMessage
     });
     console.log(`[Database] Order ${commandId} CANCELLED: ${errorMessage}`);
    }
   } catch (error) {
    console.error("Error updating command state in database:", error.message);
   }
  });

 } catch (error) {
  console.error("Error setting up validation response listener:", error);
 }
};

