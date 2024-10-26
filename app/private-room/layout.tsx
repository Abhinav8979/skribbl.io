import PrivateRoom from "../../layout/PrivateRoomLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PrivateRoom>{children}</PrivateRoom>;
}
