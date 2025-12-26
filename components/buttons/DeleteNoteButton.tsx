"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { deleteNoteAction } from "@/app/actions/notes";

type DeleteNoteButtonProps = {
  noteId: string;
  deleteNoteLocally: (noteId: string) => void;
};
function DeleteNoteButton({ noteId, deleteNoteLocally }: DeleteNoteButtonProps) {

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const noteIdParam = useSearchParams().get("noteId") || "";

  const handleDeleteNote = async () => {


    startTransition(async () => {
      const { errorMessage } = await deleteNoteAction(noteId);

      if (errorMessage) {
        console.error("Error deleting note:", errorMessage);
        toast.error("Failed to delete note");
        return;
      }
      toast.success("Note deleted successfully");
      deleteNoteLocally(noteId);

      if (noteIdParam === noteId) {
        router.replace("/");
      }
    });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="absolute top-1/2 right-2 size-7 -translate-y-1/2 p-0 opacity-0 group-hover/items:opacity-100 [&_svg]:size-3">
          <Trash2 /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Your note will be lost forever.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteNote} className="bg-destructive text-destructive hover:bg-destructive/90 w-24">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default DeleteNoteButton;