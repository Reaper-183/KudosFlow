
import { mockUsers, mockKudos } from '../data';
import { Kudos, User } from '../types';

export const resolvers = {
  Query: {
    recognitions: (_: any, { filter }: any, { role, userId }: any) => {
      // Mocking context: in a real app, userId and role would come from an auth system.
      const currentUser: User = mockUsers[0];
      userId = currentUser.id;
      role = currentUser.role;

      return mockKudos.filter(kudo => {
        // Visibility filter
        if (kudo.privacy === 'PRIVATE' && kudo.recipient.id !== userId && kudo.sender.id !== userId && role === 'EMPLOYEE') {
          return false;
        }

        // Team filter (only for managers/HR)
        if (filter?.team && (role === 'MANAGER' || role === 'HR')) {
          if (kudo.recipient.team !== filter.team) return false;
        }

        // Keyword filter
        if (filter?.keyword) {
          if (!kudo.message.toLowerCase().includes(filter.keyword.toLowerCase())) return false;
        }
        
        return true;
      }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
    analytics: (_: any, { filter }: any) => {
      let filtered = mockKudos;
      if (filter.team) {
        filtered = filtered.filter(k => k.recipient.team === filter.team);
      }
      if (filter.keyword) {
        filtered = filtered.filter(k => k.message.includes(filter.keyword));
      }

      const totalRecognitions = filtered.length;
      
      const keywords: { [key: string]: number } = {};
      filtered.forEach(kudo => {
        kudo.message.toLowerCase().split(/\s+/).forEach(word => {
            const cleanWord = word.replace(/[^a-z]/g, '');
            if(cleanWord.length > 2) {
                keywords[cleanWord] = (keywords[cleanWord] || 0) + 1;
            }
        });
      });
      const topKeywords = Object.entries(keywords).sort((a, b) => b[1] - a[1]).slice(0, 5).map(entry => entry[0]);

      const teams: { [key: string]: number } = {};
      filtered.forEach(kudo => {
        const team = kudo.recipient.team;
        teams[team] = (teams[team] || 0) + 1;
      });
      const recognitionsByTeam = Object.entries(teams).map(([team, count]) => ({ team, count }));

      const engagementData = [
        { month: 'January', count: 186 },
        { month: 'February', count: 305 },
        { month: 'March', count: 237 },
        { month: 'April', count: 273 },
        { month: 'May', count: 209 },
        { month: 'June', count: 250 },
      ];

      return { totalRecognitions, topKeywords, recognitionsByTeam, engagementOverTime: engagementData };
    }
  },
  Mutation: {
    sendRecognition: (_: any, { input }: any, { userId }: any) => {
        const currentUser: User = mockUsers.find(u => u.id === userId) || mockUsers[0];
        const recipient = mockUsers.find(u => u.id === input.recipientId);

        if (!recipient) throw new Error("Recipient not found");
      
        const emojiRegex = /[\p{Emoji_Presentation}\p{Emoji}]+/gu;
        const emojis = input.message.match(emojiRegex) || [];
        const messageWithoutEmojis = input.message.replace(emojiRegex, '').trim();

        const newRecognition: Kudos = {
            id: `k${Date.now()}`,
            sender: currentUser,
            recipient,
            message: messageWithoutEmojis,
            emojis,
            privacy: input.privacy,
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: []
        };
        mockKudos.unshift(newRecognition);
        return newRecognition;
    },
    likeRecognition: (_: any, { id }: any) => {
      const kudo = mockKudos.find(k => k.id === id);
      if (kudo) {
          kudo.likes = (kudo.likes || 0) + 1;
          return kudo;
      }
      throw new Error('Recognition not found');
    },
    addComment: (_: any, { recognitionId, message }: any, { userId }: any) => {
      const currentUser: User = mockUsers.find(u => u.id === userId) || mockUsers[0];
      const kudo = mockKudos.find(k => k.id === recognitionId);
      if (!kudo) throw new Error('Recognition not found');
      
      const newComment = {
        id: `c${Date.now()}`,
        author: currentUser,
        message,
        timestamp: new Date().toISOString()
      };
      kudo.comments.push(newComment);
      return newComment;
    }
  },
  Recognition: {
    sender: (kudo: Kudos, _: any, { role, userId }: any) => {
      if (!kudo.sender) return null;
      
      const currentUser: User = mockUsers.find(u => u.id === userId) || mockUsers[0];
      userId = currentUser.id;
      role = currentUser.role;

      if (kudo.privacy === 'ANONYMOUS' && role === 'EMPLOYEE' && kudo.sender.id !== userId) {
        // Return a modified sender object for anonymous kudos to non-involved employees
        return { ...kudo.sender, id: 'anonymous', name: 'Anonymous', avatarUrl: undefined };
      }
      return kudo.sender;
    },
  }
};
