import { StyleSheet } from 'react-native';
import { metrics, typography } from '../../styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.md,
    borderBottomWidth: .5,
    ...metrics.shadows.card,
  },
  headerPlaceholder: {
    width: 40,
  },
  headerTitle: {
    ...typography.textStyles.h3,
    flex: 1,
    textAlign: 'center',
  },
  refreshButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  searchButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },

  // Categories
  categoriesContainer: {
    paddingVertical: metrics.spacing.md,
  },
});