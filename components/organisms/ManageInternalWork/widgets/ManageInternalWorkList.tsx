import { ManageInternalWorkCard } from "@components/organisms/ManageInternalWork/widgets/ManageInternalWorkCard";
import { Group, Pagination } from "@mantine/core";
import { styled } from "@stitches";
import { InternalWorkFull } from "@utils/internalWork";
import { FC, useEffect, useMemo, useState } from "react";

export const ManageInternalWorkListSC = styled("ul", {
  li: {
    marginTop: "$12",
    paddingTop: "$8",
    borderTop: "1px solid lightgray",
  },
});

export type ManageInternalWorkListProps = {
  internalWorks: InternalWorkFull[];
  onChange?: () => void;
};

const limit = 5;

export const ManageInternalWorkList: FC<ManageInternalWorkListProps> = ({
  internalWorks,
  onChange,
}) => {
  const [page, setPage] = useState(0);

  const totalPage = useMemo(() => {
    return Math.max(Math.ceil(internalWorks.length / limit), 1);
  }, [internalWorks.length]);

  useEffect(() => {
    setPage(0);
  }, [internalWorks]);

  return (
    <ManageInternalWorkListSC>
      {internalWorks.slice(page * limit, page * limit + limit).map((iw) => (
        <li key={iw.id}>
          <ManageInternalWorkCard internalWork={iw} onChange={onChange} />
        </li>
      ))}
      <Group position="center" mt="md">
        <Pagination
          page={page + 1}
          total={totalPage}
          onChange={(page) => setPage(page - 1)}
        />
      </Group>
    </ManageInternalWorkListSC>
  );
};
