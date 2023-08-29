import React, { ChangeEvent } from 'react';
import { MemberType } from './App';

type NewMemberModalProps = {
  member: MemberType;
  setMember: React.Dispatch<React.SetStateAction<MemberType>>;
  isOpen: boolean;
  postNewMember: (memberName: string) => void
};;

const NewMemberModal: React.FC<NewMemberModalProps> = ({ member, setMember, postNewMember, isOpen }) => {

  const handleMemberNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMember({ ...member, memberName: e.target.value });
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-90 bg-black">
          <div className="modal-box bg-gray-300 z-50 p-8 rounded-lg shadow-lg">
            <h3 className="mb-4 text-lg text-center text-gray-600">
              Haven't seen you here before..
            </h3>
            <div className="mb-6 text-center">
              <input
                type="text"
                placeholder="Enter name"
                className="input w-full max-w-xs py-2 px-4 rounded text-white-600"
                value={member.memberName}
                onChange={handleMemberNameChange}
              />
            </div>
            <div className="modal-action text-center">
              <button className="btn px-4 py-2 rounded bg-blue-500 text-white mx-auto"
                onClick={() => postNewMember(member.memberName)}>
                Enter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewMemberModal;

