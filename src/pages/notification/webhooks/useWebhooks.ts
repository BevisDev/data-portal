import { App } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApi, notificationErrorMessage } from "../../../services/notificationApi";
import type { SaveWebhookRequest } from "../../../types/notification";
import { notificationKeys } from "../shared/queryKeys";

export const useWebhookList = () => useQuery({ queryKey: notificationKeys.webhooks, queryFn: notificationApi.listWebhooks });

/** `editingTargetCode` null = create, otherwise update the webhook of that target. */
export const useSaveWebhook = (editingTargetCode: string | null, onSaved: () => void) => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SaveWebhookRequest) =>
      editingTargetCode ? notificationApi.updateWebhook(editingTargetCode, body) : notificationApi.createWebhook(body),
    onSuccess: () => {
      message.success(editingTargetCode ? "Webhook updated." : "Webhook created.");
      onSaved();
      void queryClient.invalidateQueries({ queryKey: notificationKeys.webhooks });
    },
    onError: (error) => message.error(notificationErrorMessage(error)),
  });
};

export const useDeleteWebhook = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.deleteWebhook,
    onSuccess: () => {
      message.success("Webhook deleted.");
      void queryClient.invalidateQueries({ queryKey: notificationKeys.webhooks });
    },
    onError: (error) => message.error(notificationErrorMessage(error)),
  });
};
