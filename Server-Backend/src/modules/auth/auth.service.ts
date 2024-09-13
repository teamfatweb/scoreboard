import prisma from "../../utils/client";

const getUser = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email },
    });
    return user;
  } catch (err) {
    return false;
  }
};

export default { getUser };
