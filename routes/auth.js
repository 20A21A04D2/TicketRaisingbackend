const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Ticket=require('../models/Ticket')
router.post('/signup', async (req, res) => {
  const { username, email, type, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }
    user = new User({
      username,
      email,
      type,
      password
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    res.json({ message: {user: user.type }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/addticket', async (req, res) => {
  const { ticketName, ticketDescription, ticketType, projectName, email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const newTicket = new Ticket({
      ticketName,
      ticketDescription,
      ticketType,
      projectName,
      email,
      status: 'pending',
    });
    console.log(newTicket)
    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to raise ticket' });
  }
});

router.get('/alltickets', async (req, res) => {
  const { email } = req.query; 
  try {
    const tickets = await Ticket.find({ email });
    res.json(tickets);

  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});
router.delete('/deleteticket/:id', async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});
router.get('/getticket/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/updateticket/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });
    res.json({ msg: 'Ticket updated successfully', ticket });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});
router.get('/user-count', async (req, res) => {
  try {
    const count = await User.countDocuments({ type: 'user' });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ type: 'user' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/ticket-count', async (req, res) => {
  try {
    const count = await Ticket.countDocuments({});
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/pending-ticket-count', async (req, res) => {
  try {
    const count = await Ticket.countDocuments({ status: 'pending' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/completed-ticket-count', async (req, res) => {
  try {
    const count = await Ticket.countDocuments({ status: 'Completed' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/assignment-count', async (req, res) => {
  try {
    const count = await Ticket.countDocuments({ status: 'Incompleted' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/work-assignment-count', async (req, res) => {
  try {
    const count = await Ticket.countDocuments({ status: 'assigned' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/pending-ticket', async (req, res) => {
  try {
    const tickets = await Ticket.find({ status: 'pending' });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/d-count', async (req, res) => {
  try {
    const count = await User.countDocuments({ type: 'developer' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/developers', async (req, res) => {
  try {
    const developers = await User.find({ type: 'developer' }); 
    res.json(developers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/assign-ticket', async (req, res) => {
  const { ticketId, developerId } = req.body;
  
  try {
    console.log('Received ticketId:', ticketId);
    console.log('Received developerId:', developerId);
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      console.error('Ticket not found');
      return res.status(404).json({ message: 'Ticket not found' });
    }
    const developer = await User.findById(developerId);
    if (!developer) {
      console.error('Developer not found');
      return res.status(404).json({ message: 'Developer not found' });
    }
    ticket.assignedTo = developerId;
    ticket.status = 'assigned'; 
    ticket.developerMail=developer.email;
    await ticket.save();

    res.status(200).json({ message: 'Ticket assigned successfully', ticket });
  } catch (error) {
    console.error('Error assigning ticket:', error);
    res.status(500).json({ message: error.message });
  }
});



router.get('/getticket', async (req, res) => {
  const email = req.query.email;
  console.log(email)
  try {
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const tickets = await Ticket.find({ developerMail: email });
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});



router.put('/completeticket', async (req, res) => {
  const { ticketId, status, solution } = req.body;
  console.log('Received ticketId:', ticketId);
  console.log('Received status:', status);
  console.log('Received solution:', solution);

  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, { status, solution }, { new: true });
    console.log('Updated ticket:', updatedTicket);

    if (updatedTicket) {
      res.json({ status: updatedTicket.status, solution: updatedTicket.solution });
    } else {
      res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});
router.get('/pending-tickets', async (req, res) => {
  try {
    const pendingTickets = await Ticket.find({ status: 'pending' });
    res.json(pendingTickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending tickets' });
  }
});
router.get('/completedtickets', async (req, res) => {
  try {
    const completeTickets = await Ticket.find({ status: 'Completed' });
    res.json(completeTickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching completed tickets' });
  }
});
router.get('/inctickets', async (req, res) => {
  try {
    const incTickets = await Ticket.find({ status: 'Incompleted' });
    res.json(incTickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching completed tickets' });
  }
});
router.get('/assigntickets', async (req, res) => {
  try {
    const incTickets = await Ticket.find({ status: 'assigned' });
    res.json(incTickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching completed tickets' });
  }
});

module.exports = router;
