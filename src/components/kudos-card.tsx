
'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Comment, Kudos } from "@/lib/types";
import { Button } from "./ui/button";
import { ThumbsUp, MessageCircle, Send } from "lucide-react";
import { Badge } from "./ui/badge";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { addComment, likeKudo } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type KudosCardProps = {
  kudo: Kudos;
};

export function KudosCard({ kudo }: KudosCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [showComments, setShowComments] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [isLiking, startLikeTransition] = React.useTransition();
  const [isCommenting, startCommentTransition] = React.useTransition();


  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('');
  };

  const handleLike = () => {
    startLikeTransition(async () => {
      const result = await likeKudo(kudo.id);
       if (result) {
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: "Failed to like kudos.",
          variant: "destructive",
        });
      }
    });
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    startCommentTransition(async () => {
      const result = await addComment({ kudosId: kudo.id, message: comment });
      if (result) {
        setComment("");
        if (!showComments) {
            setShowComments(true);
        }
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: "Failed to add comment.",
          variant: "destructive",
        });
      }
    });
  };

  const isAnonymous = kudo.privacy.toLowerCase() === 'anonymous';
  const senderName = isAnonymous ? "Anonymous" : kudo.sender?.name || 'Anonymous';

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={isAnonymous ? undefined : kudo.sender?.avatarUrl} alt={senderName} />
            <AvatarFallback>{isAnonymous ? 'A' : getInitials(senderName)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-base font-semibold font-headline">
              {senderName}
            </p>
            <p className="text-sm font-normal text-muted-foreground">
              to {kudo.recipient.name}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-foreground">{kudo.message}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {kudo.emojis.map((emoji, index) => (
            <span key={index} className="text-2xl">{emoji}</span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2">
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(kudo.timestamp), { addSuffix: true })}
        </div>

        {(kudo.likes > 0 || kudo.comments.length > 0) && (
            <div className="flex w-full items-center gap-4 text-xs text-muted-foreground">
                {kudo.likes > 0 && <span>{kudo.likes} {kudo.likes === 1 ? 'Like' : 'Likes'}</span>}
                {kudo.comments.length > 0 && <button onClick={() => setShowComments(!showComments)} className="hover:underline">{kudo.comments.length} {kudo.comments.length === 1 ? 'Comment' : 'Comments'}</button>}
            </div>
        )}
        
        <Separator />

        <div className="flex w-full items-center justify-between">
            <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleLike} disabled={isLiking}>
                    <ThumbsUp />
                    Like
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
                    <MessageCircle />
                    Comment
                </Button>
            </div>
            {kudo.privacy.toLowerCase() !== 'public' && <Badge variant="outline" className="capitalize">{kudo.privacy.toLowerCase()}</Badge>}
        </div>

        {showComments && (
            <div className="w-full pt-4 space-y-4">
                <Separator />
                {kudo.comments.map(c => (
                    <div key={c.id} className="flex items-start gap-3">
                         <Avatar className="h-8 w-8">
                            <AvatarImage src={c.author?.avatarUrl} alt={c.author?.name} />
                            <AvatarFallback>{c.author ? getInitials(c.author.name) : '?'}</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted p-3 rounded-lg w-full">
                            <p className="text-sm font-semibold">{c.author?.name || 'User'}</p>
                            <p className="text-sm">{c.message}</p>
                        </div>
                    </div>
                ))}
                 <form onSubmit={handleCommentSubmit} className="flex w-full items-center gap-2">
                    <Input 
                        placeholder="Write a comment..." 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={isCommenting}
                    />
                    <Button type="submit" size="icon" disabled={isCommenting || !comment.trim()}>
                        <Send />
                    </Button>
                </form>
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
