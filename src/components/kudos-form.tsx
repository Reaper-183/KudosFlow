
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { mockUsers } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { generateSuggestions, sendKudos } from '@/lib/actions';
import { KudosSuggestionOutput } from '@/ai/flows/kudos-suggestion';
import { Badge } from './ui/badge';
import { Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  recipientId: z.string().min(1, 'Please select a recipient.'),
  message: z.string().min(10, 'Message must be at least 10 characters long.'),
  privacy: z.enum(['PUBLIC', 'PRIVATE', 'ANONYMOUS']),
});

type KudosFormProps = {
  onFormSubmit: () => void;
};

export function KudosForm({ onFormSubmit }: KudosFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [suggestions, setSuggestions] = React.useState<KudosSuggestionOutput | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false);
  const [isSubmitting, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientId: '',
      message: '',
      privacy: 'PUBLIC',
    },
  });

  const messageValue = form.watch('message');

  const handleGenerateSuggestions = React.useCallback(async (message: string) => {
    if (message.length < 15 || isLoadingSuggestions) return;
    setIsLoadingSuggestions(true);
    const result = await generateSuggestions({ message });
    if (result) {
      setSuggestions(result);
    }
    setIsLoadingSuggestions(false);
  }, [isLoadingSuggestions]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      handleGenerateSuggestions(messageValue);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [messageValue, handleGenerateSuggestions]);

  const appendSuggestion = (text: string) => {
    form.setValue('message', `${form.getValues('message')} ${text}`);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await sendKudos(values);
      if (result) {
        toast({
          title: 'Kudos Sent! 🎉',
          description: 'Your recognition has been sent successfully.',
        });
        onFormSubmit();
        form.reset();
        setSuggestions(null);
        router.refresh();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send kudos.',
          variant: 'destructive',
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="recipientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a colleague" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockUsers.filter(u => u.id !== mockUsers[0].id).map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} - {user.team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your appreciation..."
                  className="resize-none"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(isLoadingSuggestions || suggestions) && (
          <div className="p-3 rounded-md border border-dashed bg-accent/20">
            <div className="flex items-center gap-2 text-sm font-semibold mb-2 text-primary">
              {isLoadingSuggestions ? <Loader2 className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              AI Suggestions
            </div>
            {isLoadingSuggestions ? (
              <p className="text-sm text-muted-foreground">Generating ideas...</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {suggestions?.emojis?.map((emoji) => (
                    <button type="button" key={emoji} onClick={() => appendSuggestion(emoji)} className="text-2xl hover:scale-125 transition-transform">
                        {emoji}
                    </button>
                ))}
                {suggestions?.keywords?.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => appendSuggestion(`#${keyword}`)}>
                        #{keyword}
                    </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        <FormField
          control={form.control}
          name="privacy"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Visibility</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="PUBLIC" />
                    </FormControl>
                    <FormLabel className="font-normal">Public</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="PRIVATE" />
                    </FormControl>
                    <FormLabel className="font-normal">Private (sender and recipient only)</FormLabel>
                  </FormItem>
                   <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ANONYMOUS" />
                    </FormControl>
                    <FormLabel className="font-normal">Anonymous</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Kudos
        </Button>
      </form>
    </Form>
  );
}
