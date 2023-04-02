type User = {
  id: string;
  roleSlug: string;
  name: string;
  email: string;
  password: string;
  document: string;
  picture: string | null;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
};

export default User;
