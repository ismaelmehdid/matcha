import type { User } from "@/types/user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useInterests } from "@/hooks/useInterests";
import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "@/components/ui/shadcn-io/tags";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, type ChangeEvent } from "react";
import { Button } from "./ui/button";
import { Camera, XIcon } from "lucide-react";

function FileInputWithCamera() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="relative w-full">
      <div className="w-full h-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors relative overflow-hidden cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 z-20 rounded-full"
            >
              <XIcon size={12} />
            </Button>
          </>
        ) : (
          <Camera className="w-6 h-6 text-gray-400" />
        )}
      </div>
    </div>
  );
}

export function CompleteProfileForm() {
  const { data: interestsOptions, isLoading, isSuccess } = useInterests();
  const [newInterest, setNewInterest] = useState<string>("");
  const [selectedInterestIds, setSelectedInterestIds] = useState<Set<string>>(
    new Set()
  );

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterestIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(interestId)) {
        newSet.delete(interestId);
      } else {
        newSet.add(interestId);
      }
      return newSet;
    });
  };

  const getSelectedInterests = () => {
    return (
      interestsOptions?.filter((interest) =>
        selectedInterestIds.has(interest.id)
      ) || []
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete your profile to start dating!</CardTitle>
        <CardDescription>
          Make sure to fill out all the fields below to complete your profile
          and match with the right people.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel>What is your gender?</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>What is your sexual orientation?</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your sexual orientation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="straight">Straight</SelectItem>
                  <SelectItem value="gay">Gay</SelectItem>
                  <SelectItem value="bisexual">Bisexual</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Who are you?</FieldLabel>
              <Textarea placeholder="Describe yourself in a few words" />
            </Field>
            <Field>
              <FieldLabel>What are your interests?</FieldLabel>
              {isLoading && <Skeleton className="h-10 w-full" />}
              {isSuccess && (
                <Tags className="max-w-full">
                  <TagsTrigger>
                    {getSelectedInterests().map((interest) => (
                      <TagsValue
                        key={interest.id}
                        onRemove={() => handleInterestToggle(interest.id)}
                      >
                        {interest.name}
                      </TagsValue>
                    ))}
                  </TagsTrigger>
                  <TagsContent>
                    <TagsInput
                      onValueChange={setNewInterest}
                      placeholder="Search interest..."
                    />
                    <TagsList>
                      <TagsEmpty />
                      <TagsGroup>
                        {interestsOptions
                          ?.filter(
                            (interest) => !selectedInterestIds.has(interest.id)
                          )
                          .map((interest) => (
                            <TagsItem
                              key={interest.id}
                              onSelect={() => handleInterestToggle(interest.id)}
                              value={interest.id}
                            >
                              {interest.name}
                            </TagsItem>
                          ))}
                      </TagsGroup>
                    </TagsList>
                  </TagsContent>
                </Tags>
              )}
            </Field>
            <Field>
              <FieldLabel>Upload up to 6 pictures of yourself</FieldLabel>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <FileInputWithCamera />
                  </div>
                  <div className="flex-1">
                    <FileInputWithCamera />
                  </div>
                  <div className="flex-1">
                    <FileInputWithCamera />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <FileInputWithCamera />
                  </div>
                  <div className="flex-1">
                    <FileInputWithCamera />
                  </div>
                  <div className="flex-1">
                    <FileInputWithCamera />
                  </div>
                </div>
              </div>
              <Button className="mt-4 w-full" type="submit">
                Complete Profile
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

export function CompleteProfile({ user }: { user: User }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        <CompleteProfileForm />
      </div>
    </div>
  );
}
