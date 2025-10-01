import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { metrics, typography } from '../../styles';

export const styles = StyleSheet.create({
  // Modal Overlay
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  modalContainer: {
    flex: 1,
    borderTopLeftRadius: metrics.radius.card,
    borderTopRightRadius: metrics.radius.card,
    maxHeight: '90%',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
  },

  headerTitle: {
    ...typography.textStyles.h3,
    fontFamily: typography.fonts.inter.bold,
    flex: 1,
    textAlign: 'center',
  },

  closeButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Form Content
  formContent: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(24),
  },

  inputGroup: {
    marginBottom: verticalScale(24),
  },

  inputLabel: {
    ...typography.textStyles.body1,
    fontFamily: typography.fonts.inter.medium,
    marginBottom: verticalScale(8),
  },

  // Text Inputs
  textInput: {
    height: verticalScale(56),
    paddingHorizontal: scale(16),
    borderWidth: 1,
    borderRadius: metrics.radius.input,
    ...typography.textStyles.body1,
    fontFamily: typography.fonts.inter.regular,
  },

  textArea: {
    minHeight: verticalScale(120),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    borderWidth: 1,
    borderRadius: metrics.radius.input,
    ...typography.textStyles.body1,
    fontFamily: typography.fonts.inter.regular,
    textAlignVertical: 'top',
  },

  // Price Input
  priceContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },

  pricePrefix: {
    position: 'absolute',
    left: scale(16),
    zIndex: 1,
    ...typography.textStyles.body1,
    fontFamily: typography.fonts.inter.regular,
  },

  priceInput: {
    flex: 1,
    height: verticalScale(56),
    paddingLeft: scale(48), // Space for R$ prefix
    paddingRight: scale(16),
    borderWidth: 1,
    borderRadius: metrics.radius.input,
    ...typography.textStyles.body1,
    fontFamily: typography.fonts.inter.regular,
  },

  // Character Count
  characterCount: {
    ...typography.textStyles.caption,
    fontFamily: typography.fonts.inter.regular,
    textAlign: 'right',
    marginTop: verticalScale(4),
  },

  // Category Selector
  categorySelector: {
    height: verticalScale(56),
    paddingHorizontal: scale(16),
    borderWidth: 1,
    borderRadius: metrics.radius.input,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  categoryText: {
    ...typography.textStyles.body1,
    fontFamily: typography.fonts.inter.regular,
    flex: 1,
  },

  categoryPlaceholder: {
    ...typography.textStyles.body1,
    fontFamily: typography.fonts.inter.regular,
    flex: 1,
  },

  // Category Picker
  categoryPicker: {
    marginTop: verticalScale(8),
    borderWidth: 1,
    borderRadius: metrics.radius.input,
    overflow: 'hidden',
  },

  categoryOption: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
  },

  categoryOptionText: {
    ...typography.textStyles.body1,
    fontFamily: typography.fonts.inter.regular,
  },

  // Buttons
  buttonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    gap: scale(16),
    borderTopWidth: 1,
    borderTopColor: 'transparent', // Will be overridden by dynamic styles
  },

  cancelButton: {
    flex: 1,
    height: verticalScale(56),
    borderRadius: metrics.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    ...typography.textStyles.body1,
    fontFamily: typography.fonts.inter.semibold,
  },

  saveButton: {
    flex: 1,
    height: verticalScale(56),
    borderRadius: metrics.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    ...typography.textStyles.body1,
    fontFamily: typography.fonts.inter.semibold,
  },
});