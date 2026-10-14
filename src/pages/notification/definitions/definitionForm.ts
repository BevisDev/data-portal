import type { DefinitionData, SaveDefinitionRequest } from "../../../types/notification";
import { CHANNEL_BY_ID } from "../shared/notificationForm";

export type DefinitionFormValues = SaveDefinitionRequest;

export const NEW_DEFINITION: Partial<DefinitionFormValues> = {
  status: "ACTIVE",
  level: "INFO",
  channel_code: "EMAIL",
  targets: [{ target_code: "" }],
};

// The service returns ids only, so source and target codes have to be re-entered on edit.
export const definitionToForm = (definition: DefinitionData): Partial<DefinitionFormValues> => ({
  code: definition.code,
  name: definition.name,
  description: definition.description,
  status: definition.status,
  level: definition.level,
  channel_code: CHANNEL_BY_ID[definition.channel_id],
  targets: definition.targets.map((target) => ({ target_code: "", template_id: target.template_id })),
});

export const formToDefinitionRequest = (values: DefinitionFormValues): SaveDefinitionRequest => ({
  ...values,
  description: values.description?.trim() || null,
  targets: values.targets.map((target) => ({
    target_code: target.target_code.trim().toUpperCase(),
    template_id: target.template_id ?? null,
  })),
});
