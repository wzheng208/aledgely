import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { RecordItem } from '@/services/records.service';

type DeleteRecordDialogProps = {
  open: boolean;
  record: RecordItem | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteRecordDialog({
  open,
  record,
  loading = false,
  onClose,
  onConfirm,
}: DeleteRecordDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete record?</AlertDialogTitle>
          <AlertDialogDescription>
            {record
              ? `This will permanently delete the ${record.type} record from ${record.date}.`
              : 'This action will permanently delete this record.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={loading}
            className='bg-red-600 text-white hover:bg-red-700'
          >
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
