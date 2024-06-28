export default function Home(props: { params: { slug: string[] } }) {
  return (
    <div>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
}
