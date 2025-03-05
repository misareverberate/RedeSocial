import { useMutation } from "@tanstack/react-query";
import React, { ChangeEvent, useState } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface PostInput {
  title: string;
  content: string;
  avatar_url:string | null
}

async function createPost(post: PostInput, imageFile: File) {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;
  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);
  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = await supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);
  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl});
  if (error) throw new Error(error.message);
  return data;
}


function CreatePost() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const {user} = useAuth()
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    mutate({ post: { title, content, avatar_url: user?.user_metadata.avatar_url}, imageFile: selectedFile });
  };
  function handleFileChange(e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }

  return (
    <form
      action=""
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-4"
    >
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>
        <textarea
          id="content"
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          rows={5}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="image" className="block mb-2 font-medium">
          Upload Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-gray-200"
        />
      </div>
      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>

      {isError && <p className="text-red-500"> Error creating post.</p>}
    </form>
  );
}

export default CreatePost;
