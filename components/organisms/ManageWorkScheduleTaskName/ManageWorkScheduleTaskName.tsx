import { TrashCan20 } from "@carbon/icons-react";
import { useWorkScheduleTaskNames } from "@hooks";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Pagination,
  TextInput,
} from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import { styled } from "@stitches";
import axios from "axios";
import { FC, useCallback, useMemo, useState } from "react";

export const ManageWorkScheduleTaskNameSC = styled("div", {
  ".text-input": {
    flex: "1",
  },
  ".list-task-names": {
    marginTop: "$16",
    display: "flex",
    flexDirection: "column",
    gap: "$8",
    li: {
      display: "flex",
      alignItems: "center",
      span: {
        flex: "1",
        marginLeft: "$8",
      },
    },
  },
});

const limit = 10;

export const ManageWorkScheduleTaskName: FC = () => {
  const { workScheduleTaskNames, mutate } = useWorkScheduleTaskNames();
  const [newName, setNewName] = useState("");
  const [modalOpened, setModalOpened] = useState(false);
  const totalPage = useMemo(
    () => Math.max(Math.ceil(workScheduleTaskNames.length / limit), 1),
    [workScheduleTaskNames.length]
  );
  const pagination = usePagination({
    total: totalPage,
    initialPage: 1,
  });

  const createWorkScheduleTaskName = useCallback(() => {
    if (newName) {
      return axios
        .post("/api/workScheduleTaskName", {
          name: newName,
        })
        .then(() => mutate())
        .then(() => {
          pagination.first();
          setNewName("");
        });
    } else {
      alert("Vous ne pouvez pas un nom vide");
    }
  }, [pagination, mutate, newName]);

  const deleteWorkScheduleTaskName = useCallback(
    (id: string) => {
      return axios
        .delete(`/api/workScheduleTaskName/${id}`)
        .then(() => {
          if (
            pagination.active !== 1 &&
            (workScheduleTaskNames.length - 1) % limit === 0
          ) {
            pagination.previous();
          }
        })
        .then(() => mutate());
    },
    [mutate, pagination, workScheduleTaskNames.length]
  );

  return (
    <>
      <Button onClick={() => setModalOpened(true)}>
        Gestion des modèles de formation
      </Button>
      <Modal
        title={
          <h2 style={{ fontWeight: "bold", fontSize: "20px" }}>
            Gestion des modèles de formation
          </h2>
        }
        onClose={() => setModalOpened(false)}
        opened={modalOpened}
      >
        <ManageWorkScheduleTaskNameSC>
          <Group align={"flex-end"}>
            <TextInput
              className="text-input"
              value={newName}
              onChange={(event) => setNewName(event.currentTarget.value)}
              label="Ajouter un nom de formation"
            />
            <Button onClick={createWorkScheduleTaskName}>Ajouter</Button>
          </Group>
          <ul className="list-task-names">
            {workScheduleTaskNames
              .slice(
                (pagination.active - 1) * limit,
                (pagination.active - 1) * limit + limit
              )
              .map(({ id, name }) => (
                <li key={id}>
                  <ActionIcon
                    variant="default"
                    onClick={() => deleteWorkScheduleTaskName(id)}
                  >
                    <TrashCan20 color="red" />
                  </ActionIcon>
                  <span>{name}</span>
                </li>
              ))}
          </ul>
          <Group position="center" mt="md">
            <Pagination
              page={pagination.active}
              total={totalPage}
              onChange={pagination.setPage}
            />
          </Group>
        </ManageWorkScheduleTaskNameSC>
      </Modal>
    </>
  );
};
