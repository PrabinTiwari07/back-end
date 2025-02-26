// // const Book = require("../model/book");

// // // Add a new booking
// // const isDateValid = (date) => {
// //     const today = new Date();
// //     today.setHours(0, 0, 0, 0);
// //     return new Date(date) >= today;
// //   };
  
// //   exports.addBook = async (req, res) => {
// //     try {
// //       const { serviceId, date, time } = req.body;
  
// //       if (!req.user || !req.user.id) {
// //         return res.status(401).json({ message: "Unauthorized: User ID not found." });
// //       }
  
// //       if (!isDateValid(date)) {
// //         return res.status(400).json({ message: "Date must be today or in the future." });
// //       }
  
// //       const existingBook = await Booking.findOne({ serviceId, date, time });
// //       if (existingBook) {
// //         return res.status(400).json({ message: "Time slot already booked for this service." });
// //       }
  
// //       const newBook = new Booking({
// //         serviceId,
// //         userId: req.user.id,
// //         date,
// //         time,
// //       });
  
// //       await newBook.save();
  
// //       // Emit a notification using Socket.IO
// //       req.io.emit("notification", {
// //         message: "Your booking has been confirmed. Check your details.",
// //         booking: {
// //           serviceId,
// //           date,
// //           time,
// //         },
// //       });
  
// //       res.status(201).json({ message: "Booking confirmed", book: newBook });
// //     } catch (error) {
// //       console.error("Error adding booking:", error);
// //       res.status(500).json({ message: "Error adding booking", error: error.message });
// //     }
// //   };
  
  

// // // Get all bookings for a specific service
// // exports.getBooksByService = async (req, res) => {
// //   try {
// //     const { serviceId } = req.params;
// //     const books = await Book.find({ serviceId })
// //       .sort({ date: 1, time: 1 })
// //       .populate("userId", "fullname email phone")
// //       // .select("pickupLocation dropOffLocation date time status");

// //     res.status(200).json(books);
// //   } catch (error) {
// //     res.status(500).json({ message: "Error fetching bookings", error: error.message });
// //   }
// // };

  

// // // Get all bookings for the logged-in user
// // exports.getUserBooks = async (req, res) => {
// //     try {
// //       const books = await Book.find({ userId: req.user.id })
// //         .sort({ date: 1, time: 1 })
// //         .populate("serviceId", "title description price"); // Include service details
// //       res.status(200).json(books);
// //     } catch (error) {
// //       res.status(500).json({ message: "Error fetching user bookings", error: error.message });
// //     }
// //   };

// // exports.getAllBookings = async (req, res) => {
// //     try {
// //         // Ensure only admins can access all bookings
// //         if (!req.user || req.user.role !== "admin") {
// //         return res.status(403).json({ message: "Access denied. Admins only." });
// //         }

// //         // Fetch all bookings with user and service details
// //         const bookings = await Book.find().populate("userId serviceId");

// //         res.status(200).json(bookings);
// //     } catch (error) {
// //         res.status(500).json({ message: "Error fetching bookings", error: error.message });
// //     }
// //     };
  
  


// // // Add a new booking
// // exports.addBook = async (req, res) => {
// //   try {
// //     const { serviceId, date, time } = req.body;

// //     if (!req.user || !req.user.id) {
// //       return res.status(401).json({ message: "Unauthorized: User ID not found." });
// //     }

// //     // Check if the time slot is already booked for this service
// //     const existingBook = await Book.findOne({ serviceId, date, time });
// //     if (existingBook) {
// //       return res.status(400).json({ message: "Time slot already booked for this service." });
// //     }

// //     const newBook = new Book({
// //       serviceId,
// //       userId: req.user.id,  // Attach userId from the authenticated token
// //       date,
// //       time
// //     });

// //     await newBook.save();
// //     res.status(201).json({ message: "Booking confirmed", book: newBook });
// //   } catch (error) {
// //     res.status(500).json({ message: "Error adding booking", error: error.message });
// //   }
// // };


// // // Update Booking Status
// // exports.updateBookingStatus = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { status } = req.body;

// //     if (!["pending", "confirmed", "canceled"].includes(status)) {
// //       return res.status(400).json({ message: "Invalid status value" });
// //     }

// //     const updatedBooking = await Booking.findByIdAndUpdate(
// //       id,
// //       { status },
// //       { new: true, runValidators: true }
// //     );

// //     if (!updatedBooking) {
// //       return res.status(404).json({ message: "Booking not found" });
// //     }

// //     res.status(200).json({ message: "Booking status updated", booking: updatedBooking });
// //   } catch (error) {
// //     res.status(500).json({ message: "Error updating booking status", error: error.message });
// //   }
// // };
  


// const Book = require("../model/book");

// // Utility function to validate the date
// const isDateValid = (date) => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   return new Date(date) >= today;
// };

// // Add a new booking
// exports.addBook = async (req, res) => {
//   try {
//     const { serviceId, date, time } = req.body;

//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Unauthorized: User ID not found." });
//     }

//     if (!isDateValid(date)) {
//       return res.status(400).json({ message: "Date must be today or in the future." });
//     }

//     // Check if the time slot is already booked for this service
//     const existingBook = await Book.findOne({ serviceId, date, time });
//     if (existingBook) {
//       return res.status(400).json({ message: "Time slot already booked for this service." });
//     }

//     const newBook = new Book({
//       serviceId,
//       userId: req.user.id,
//       date,
//       time,
//     });

//     await newBook.save();

//     // Emit a notification using Socket.IO to the specific user
//     req.io.emit(`notification:${req.user.id}`, {
//       message: `Your booking for service ${serviceId} on ${date} at ${time} has been confirmed. Click to view details.`,
//       bookingId: newBook._id,
//       serviceId,
//       date,
//       time,
//     });
    
//     res.status(201).json({ message: "Booking confirmed", book: newBook });
//   } catch (error) {
//     console.error("Error adding booking:", error);
//     res.status(500).json({ message: "Error adding booking", error: error.message });
//   }
// };

// // Get all bookings for a specific service
// exports.getBooksByService = async (req, res) => {
//   try {
//     const { serviceId } = req.params;
//     const books = await Book.find({ serviceId })
//       .sort({ date: 1, time: 1 })
//       .populate("userId", "fullname email phone");

//     res.status(200).json(books);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching bookings", error: error.message });
//   }
// };

// // Get all bookings for the logged-in user
// exports.getUserBooks = async (req, res) => {
//   try {
//     const books = await Book.find({ userId: req.user.id })
//       .sort({ date: 1, time: 1 })
//       .populate("serviceId", "title description price");

//     res.status(200).json(books);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching user bookings", error: error.message });
//   }
// };

// // Get all bookings for admin
// exports.getAllBookings = async (req, res) => {
//   try {
//     if (!req.user || req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied. Admins only." });
//     }

//     const bookings = await Book.find().populate("userId serviceId");
//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching bookings", error: error.message });
//   }
// };

// // Update Booking Status
// exports.updateBookingStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!["pending", "confirmed", "canceled"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }

//     const updatedBooking = await Book.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true, runValidators: true }
//     );

//     if (!updatedBooking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     // Emit a status update notification to the user
//     req.io.emit(`notification:${updatedBooking.userId}`, {
//       message: `Your booking status has been updated to: ${status}.`,
//       bookingId: updatedBooking._id,
//     });

//     res.status(200).json({ message: "Booking status updated", booking: updatedBooking });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating booking status", error: error.message });
//   }
// };


// exports.getRecentBookings = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const recentBookings = await Book.find({ userId })
//       .sort({ createdAt: -1 })
//       .limit(10)
//       .populate("serviceId", "title description price");

//     res.status(200).json(recentBookings);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching recent bookings", error: error.message });
//   }
// };

// exports.getBookingById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const booking = await Book.findById(id).populate("serviceId", "title description price");
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }
//     res.status(200).json(booking);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching booking details", error: error.message });
//   }
// };



const Book = require("../model/book");

// Utility function to validate the date
const isDateValid = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) >= today;
};

// ✅ Add a new booking (without Socket.IO)
exports.addBook = async (req, res) => {
  try {
    const { serviceId, date, time } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User ID not found." });
    }

    if (!isDateValid(date)) {
      return res.status(400).json({ message: "Date must be today or in the future." });
    }

    // Check if the time slot is already booked for this service
    const existingBook = await Book.findOne({ serviceId, date, time });
    if (existingBook) {
      return res.status(400).json({ message: "Time slot already booked for this service." });
    }

    const newBook = new Book({
      serviceId,
      userId: req.user.id,
      date,
      time,
    });

    await newBook.save();
    
    res.status(201).json({ message: "Booking confirmed", book: newBook });
  } catch (error) {
    console.error("Error adding booking:", error);
    res.status(500).json({ message: "Error adding booking", error: error.message });
  }
};

// ✅ Get all bookings for a specific service
exports.getBooksByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const books = await Book.find({ serviceId })
      .sort({ date: 1, time: 1 })
      .populate("userId", "fullname email phone");

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// ✅ Get all bookings for admin
exports.getAllBookings = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const bookings = await Book.find().populate("userId serviceId");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// ✅ Update Booking Status (without Socket.IO)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "canceled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedBooking = await Book.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking status updated", booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking status", error: error.message });
  }
};

// // ✅ Get a specific booking by ID
// exports.getBookingById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const booking = await Book.findById(id).populate("serviceId", "title description price");
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }
//     res.status(200).json(booking);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching booking details", error: error.message });
//   }
// };


// // ✅ Get all bookings for the logged-in user
// exports.getUserBooks = async (req, res) => {
//   try {
//     const books = await Book.find({ userId: req.user.id })
//       .sort({ date: 1, time: 1 })
//       .populate("serviceId", "title description price");

//     res.status(200).json(books);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching user bookings", error: error.message });
//   }
// };

// ✅ Get all bookings for the logged-in user (with image)
exports.getUserBooks = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user.id })
      .sort({ date: 1, time: 1 })
      .populate("serviceId", "title description price image"); // ✅ Fetch service image

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bookings", error: error.message });
  }
};

// ✅ Get a specific booking by ID (with image)
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Book.findById(id).populate("serviceId", "title description price image"); // ✅ Fetch service image
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking details", error: error.message });
  }
};
