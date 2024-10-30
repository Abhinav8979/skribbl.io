import PlayerDrawingBoard from "../../components/drawing canvas/PlayerDrawingBoard";
import PrivateRoomLayout from "../../layout/PrivateRoomLayout";

const DrawPage: React.FC = () => {
  return (
    <PrivateRoomLayout>
      <PlayerDrawingBoard />
    </PrivateRoomLayout>
  );
};

export default DrawPage;
