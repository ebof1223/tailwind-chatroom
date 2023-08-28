import React, { ChangeEvent } from 'react';

type NewMemberModalProps = {
  memberName: string;
  setMemberName: (memberName: string) => void;
  isOpen: boolean;
  saveMemberName: () => void;
};

const NewMemberModal: React.FC<NewMemberModalProps> = ({memberName, setMemberName, isOpen, saveMemberName}) => {
  
  const handleMemberNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMemberName(e.target.value);
  }

  console.log(memberName);
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-10 bg-black">
          <div className="modal-box bg-gray-200 z-50 p-8 rounded-lg shadow-lg">
            <h3 className="mb-4 text-lg text-center text-gray-700">
              Haven't seen you here before..
            </h3>
            <div className="mb-6 text-center">
              <input
                type="text"
                placeholder="Enter name"
                className="input w-full max-w-xs py-2 px-4 rounded text-gray-600"
                value={memberName}
                onChange={handleMemberNameChange}
              />
            </div>
            <div className="modal-action text-center">
              <button className="btn px-4 py-2 rounded bg-blue-500 text-white mx-auto" onClick={saveMemberName}>
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

