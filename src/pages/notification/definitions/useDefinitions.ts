import { App } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApi, notificationErrorMessage } from "../../../services/notificationApi";
import type { SaveDefinitionRequest } from "../../../types/notification";
import { notificationKeys } from "../shared/queryKeys";

export const useDefinitionList = () =>
  useQuery({ queryKey: notificationKeys.definitions, queryFn: notificationApi.listDefinitions });

/** `editingCode` null = create, otherwise update that definition. */
export const useSaveDefinition = (editingCode: string | null, onSaved: () => void) => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SaveDefinitionRequest) =>
      editingCode ? notificationApi.updateDefinition(editingCode, body) : notificationApi.createDefinition(body),
    onSuccess: () => {
      message.success(editingCode ? "Definition updated." : "Definition created.");
      onSaved();
      void queryClient.invalidateQueries({ queryKey: notificationKeys.definitions });
    },
    onError: (error) => message.error(notificationErrorMessage(error)),
  });
};

export const useDeleteDefinition = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.deleteDefinition,
    onSuccess: () => {
      message.success("Definition deleted.");
      void queryClient.invalidateQueries({ queryKey: notificationKeys.definitions });
    },
    onError: (error) => message.error(notificationErrorMessage(error)),
  });
};
