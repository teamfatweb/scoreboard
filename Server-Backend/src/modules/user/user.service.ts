import prisma from "../../utils/client";
import auth from "../../utils/auth";

const listUsers = async (role: string) => {


 
  try {
    if (role === "superAdmin") {

   
      const users = await prisma.user.findMany({
        where: {
          role: "admin",
        },
        orderBy: {
          name: "asc",
        },
      });
      const sellers = await prisma.seller.findMany();
      return [...users , ...sellers];
    }
    if (role === "admin") {
      const users = await prisma.seller.findMany({
        orderBy: {
          name: "asc",
        },
      });
      return users;
    }
  } catch (err) {
    return err;
  }
};

const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (err) {
    return err;
  }
};

const getUserByName = async (name: string) => {
  try {
    // Use findMany because 'name' is not unique
    const sellers = await prisma.seller.findMany({
      where: {
        name: name,
      },
    });
    
    // Return the first seller if found, otherwise return null
    return sellers.length > 0 ? sellers[0] : null;
  } catch (err) {
    console.error('Error fetching seller by name:', err);
    throw err; // Rethrow error to be handled by the calling function
  }
};



const createUser = async (
  name: string,
  email: string,
  targetAmount: number,
  password: string,
  role: string,
  avatar: string | null
) => {
  try {
    if (role === 'superAdmin' || role === 'admin') {
      const hashed = await auth.hashPassword(password);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashed,
          role,
          avatar,
        },
      });
      return user;
    } else if (role === 'seller') {
      const seller = await prisma.seller.create({
        data: {
          name: name,
          targetAmount: targetAmount,
          avatar : avatar,
          email: email,
        },
      });
      return seller;
    } else {
      throw new Error('Invalid role specified.');
    }
  } catch (err) {
    // Log the error for debugging purposes
    console.error("Error in createUser:", err);
    throw err; // Throw the error to be handled by the calling function
  }
};



const updateUser = async (
  email: string,
  newName: string,
  targetAmount: number,
  role: string
) => {
  try {
    if (role === 'admin') {
      const user = await prisma.user.updateMany({
        where: {
          email,
        },
        data: {
          name: newName,
        },
      });
      return user;
    } else {
      const user = await prisma.seller.updateMany({
        where: {
          name: newName,
        },
        data: {
          targetAmount,
        },
      });
      return user;
    }
  } catch (err) {
    return err;
  }
};

const deleteUser = async (email: string, role: string) => {
  try {
    // console.log(`Attempting to delete user with email: ${email} and role: ${role}`);

    // Ensure valid role is specified
    if (role === 'seller') {
      // Delete seller by name
      const deletedSeller = await prisma.seller.delete({
        where: { 
          email: email,
        },
      });
      // console.log('Seller deletion result:', deletedSeller);
      return deletedSeller;
    } 
    else if (role === 'admin') {
      // Delete user by email
      const deletedUser = await prisma.user.delete({
        where: {
          email,
        },
      });
      // console.log('Admin deletion result:', deletedUser);
      return deletedUser;
    } 
    else {
      // If role is invalid
      throw new Error("Invalid role specified for deletion.");
    }
  } catch (err) {
    // Log detailed error information
    // console.error('Detailed error during user deletion:', err);

    // Return an appropriate error response
    if (err instanceof Error) {
      return {
        status: 500,
        message: err.message,
      };
    }
    return {
      status: 500,
      message: "Failed to delete user or seller.",
    };
  }
};




export default {
  getUserByEmail,
  getUserByName,
  createUser,
  listUsers,
  updateUser,
  deleteUser,
};
