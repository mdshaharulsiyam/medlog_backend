import bcrypt from "bcrypt";

const hashText = async (text: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(text, salt);
};

export const compare = async (text: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(text, hash);
}

export default hashText;