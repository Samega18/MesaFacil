import { StyleSheet } from 'react-native';

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    cancelButton: {
      padding: 8,
    },
    cancelButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '500',
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    placeholder: {
      width: 60,
    },
    form: {
      padding: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.surface,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.surface,
    },
    picker: {
      height: 50,
      color: colors.text,
    },
    pickerItem: {
      fontSize: 16,
      color: colors.text,
    },
    helperText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
      fontStyle: 'italic',
    },
    footer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });