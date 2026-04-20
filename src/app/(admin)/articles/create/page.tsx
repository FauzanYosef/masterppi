import CreateArticleForm from '@/components/Admin/Articles/Create'

export const metadata = {
  title: "Create Articles - PPI",
};

export default function CreateArticlePage() {
  return (
    <div className="p-6">
      <CreateArticleForm />
    </div>
  )
}