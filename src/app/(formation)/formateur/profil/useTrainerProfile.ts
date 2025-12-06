"use client";
import {
  SET_TRAINER_TOPICS,
  UPDATE_TRAINER,
} from "@/graphql/mutations/trainer-mutations";
import {
  DELETE_USER_MUTATION,
  UPDATE_USER_MUTATION,
} from "@/graphql/mutations/user-mutations";
import { GET_ALL_TOPICS } from "@/graphql/queries/topic-queries";
import { GET_TRAINER, USER_QUERY } from "@/graphql/queries/trainer-queries";
import { ME_QUERY } from "@/graphql/queries/user-queries";
import { useToast } from "@/providers/ToastProvider";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useTrainerProfile() {
  const [fullName, setFullName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const router = useRouter();
  const { showToast } = useToast();

  const [updateUser, { loading: updatingUser }] =
    useMutation(UPDATE_USER_MUTATION);
  const [updateTrainer, { loading: updating }] = useMutation(UPDATE_TRAINER);
  const [setTrainerTopics, { loading: updatingTopics }] =
    useMutation(SET_TRAINER_TOPICS);
  const [deleteUser, { loading: deleting }] = useMutation(DELETE_USER_MUTATION);

  const { data: meData, loading: meLoading } = useQuery(ME_QUERY);
  const userId = meData?.me?.id;

  const { data: userData, loading: userLoading } = useQuery(USER_QUERY, {
    variables: { id: userId },
    skip: !userId,
  });

  const {
    data: trainerData,
    loading: trainerLoading,
    refetch,
  } = useQuery(GET_TRAINER, {
    variables: { id: userId },
    skip: !userId,
  });

  const { data: topicsData, loading: topicsLoading } = useQuery(GET_ALL_TOPICS);

  const user = userData?.user;
  const trainer = trainerData?.trainer;
  const allTopics = topicsData?.topics || [];

  const populateForm = () => {
    if (user) setFullName(user.fullName || "");
    if (trainer) {
      setDescription(trainer.description || "");
      setSelectedTopics(trainer.topics?.map((t: { id: string }) => t.id) || []);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (user && fullName.trim() && fullName !== user.fullName) {
        await updateUser({
          variables: { userId: user.id, data: { fullName } },
        });
      }
      await updateTrainer({
        variables: { trainerId: trainer.id, description },
      });
      await setTrainerTopics({
        variables: { trainerId: trainer.id, topicIds: selectedTopics },
      });
      showToast("Profil mis à jour !", "success");
      refetch();
    } catch {
      showToast("Erreur lors de la mise à jour", "error");
    }
    setSaving(false);
  };

  const handleTopicChange = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleDelete = async () => {
    try {
      await deleteUser();
      showToast("Compte supprimé avec succès !", "success");
      localStorage.removeItem("token");
      setShowConfirm(false);
      router.replace("/");
    } catch {
      showToast("Erreur lors de la suppression du compte", "error");
      setShowConfirm(false);
    }
  };

  return {
    fullName,
    setFullName,
    description,
    setDescription,
    selectedTopics,
    saving,
    showConfirm,
    setShowConfirm,
    email: user?.email || "",
    allTopics,
    updatingUser,
    updating,
    updatingTopics,
    deleting,
    user,
    trainer,
    populateForm,
    handleSave,
    handleTopicChange,
    handleDelete,
    loading: meLoading || userLoading || topicsLoading || trainerLoading,
  };
}
