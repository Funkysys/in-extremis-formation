interface Topic {
  id: string;
  name: string;
}

interface TopicsSelectorProps {
  allTopics: Topic[];
  selectedTopics: string[];
  onTopicChange: (topicId: string) => void;
}

export function TopicsSelector({
  allTopics,
  selectedTopics,
  onTopicChange,
}: TopicsSelectorProps) {
  return (
    <div>
      <label className="block text-slate-700 font-medium mb-2">
        {"Mots-clés pour te retrouver"}
      </label>
      <div className="flex flex-wrap gap-3">
        {allTopics.map((topic) => (
          <label
            key={topic.id}
            className={`px-3 py-1 rounded-full border cursor-pointer flex items-center gap-2 ${
              selectedTopics.includes(topic.id)
                ? "bg-amber-700 text-white border-amber-700"
                : "bg-white border-slate-300 text-slate-800"
            }`}
          >
            <input
              type="checkbox"
              checked={selectedTopics.includes(topic.id)}
              onChange={() => onTopicChange(topic.id)}
              className="mr-1 accent-amber-700"
            />
            {topic.name}
          </label>
        ))}
      </div>
    </div>
  );
}
