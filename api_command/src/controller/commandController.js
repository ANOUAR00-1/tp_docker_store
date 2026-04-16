import Command from '../entity/command.js';
import axios from 'axios';

export const createCommand = async (req, res) => {
 const { products, client_id, amount } = req.body;

 try {
  
  // let clientResponse;
  try {
   clientResponse = await axios.get(`http://api_client:3000/api/clients/${client_id}`);
  } catch (err) {
   
   const status = err.response ? 404 : 503;
   const msg = err.response ? "Client not found" : "Client service is unavailable";
   return res.status(status).json({ message: msg });
  }

  
  try {
   await Promise.all(
    products.map(id => axios.get(`http://api_product:3000/api/products/${id}`))
   );
  } catch (prodError) {
   const status = prodError.response ? 404 : 503;
   const msg = prodError.response
    ? "One or more products are not found in the inventory"
    : "Product service is unavailable";
   return res.status(status).json({
    error: msg,
    details: prodError.message
   });
  }

  
  const command = new Command({
   products,
   client_id,
   amount,
   status: "Confirmed"
  });

  await command.save();
  res.status(201).json({ message: "Command created successfully", data: command });

 } catch (error) {
 
  res.status(500).json({
   message: "Internal Server Error in Command Service",
   error: error.message
  });
 }
};

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