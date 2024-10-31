import React from "react";
import GenerateAvatar from "./GenerateAvatar";

interface InviteModalProps {
  name: string | undefined;
  avatar: { eye: number; face: number; mouth: number };
  setInviteModal: (state: boolean) => void;
}

const InviteModal: React.FC<InviteModalProps> = ({
  name,
  avatar,
  setInviteModal,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={() => setInviteModal(false)}
      ></div>

      <div className="relative bg-white w-[90%] max-w-md p-6 rounded-lg shadow-lg z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold text-gray-700">{name}</h1>
          <button
            className="text-gray-500 hover:text-gray-700 transition"
            onClick={() => setInviteModal(false)}
          >
            ✕
          </button>
        </div>

        {/* Avatar */}
        <div className="flex items-center justify-center mb-4">
          <div className="scale-[1.4]">
            <GenerateAvatar
              eye={avatar.eye}
              face={avatar.face}
              mouth={avatar.mouth}
              key={name}
            />
          </div>
        </div>

        {/* Invite Section */}
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold text-gray-700">
            Invite your friends!
          </h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition duration-300">
            Click to copy Invite
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
