import { defineMessages } from 'react-intl';

export default defineMessages({
  ducklingSettingsTitle: {
    id: 'containers.DucklingSettingsPage.title',
    defaultMessage: 'Duckling Settings',
  },
  ducklingSettingsDescription: {
    id: 'containers.DucklingSettingsPage.description',
    defaultMessage: 'These are the default settings for Duckling. Whenever you create a new Agent these settings are going to be the initial settings for it.',
  },
  ducklingURL: {
    id: 'containers.DucklingSettingsPage.duckling_url',
    defaultMessage: 'Duckling URL',
  },
  ducklingURLPlaceholder: {
    id: 'containers.DucklingSettingsPage.duckling_url_placeholder',
    defaultMessage: 'Enter the URL of your duckling server',
  },
  updateSettingsButton: {
    id: 'containers.DucklingSettingsPage.edit_button',
    defaultMessage: 'Update',
  },
  successMessageEdit: {
    id: 'containers.DucklingSettingsPage.success_message_edit',
    defaultMessage: 'Duckling settings updated',
  },
  ducklingDimension: {
    id: 'containers.DucklingSettingsPage.domain_classifier_pipeline_label',
    defaultMessage: 'Duckling Dimensions',
  },
  ducklingDimensionTooltip: {
    id: 'containers.DucklingSettingsPage.domain_classifier_tooltip',
    defaultMessage: 'Duckling have multiple dimensions. With this setting you can control which dimensions you would like to be parsed in user text.',
  },
  ducklingDimensionWarningMessage: {
    id: 'containers.DucklingSettingsPage.domain_classifier_format_warning',
    defaultMessage: 'Please verify duckling dimensions is an array of strings',
  },
});