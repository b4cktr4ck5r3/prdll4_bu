import { ManageInternalWorkCard } from "@components/organisms/ManageInternalWorkModal/widgets";
import { Modal } from "@mantine/core";
import { styled } from "@stitches/react";
import { InternalWorkFull } from "@utils/internalWork";
import type { FC } from "react";

type ManageInternalWorkModalProps = {
  opened: boolean;
  onClose: () => void;
  listInternalWorks?: InternalWorkFull[];
  title?: string;
  onChange?: () => void;
};

export const ManageInternalWorkModalSC = styled("ul", {
  "& > li ": {
    marginTop: "$12",
    paddingTop: "$8",
    borderTop: "1px solid lightgray",
  },
});

export const ManageInternalWorkModal: FC<ManageInternalWorkModalProps> = ({
  listInternalWorks = [],
  opened,
  onClose,
  title,
  onChange = () => null,
}) => {
  return (
    <Modal title={title} opened={opened} onClose={onClose}>
      <ManageInternalWorkModalSC>
        {listInternalWorks.map((iw) => (
          <li key={iw.id}>
            <ManageInternalWorkCard internalWork={iw} onChange={onChange} />
          </li>
        ))}
      </ManageInternalWorkModalSC>
    </Modal>
  );
};
