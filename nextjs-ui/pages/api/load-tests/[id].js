export default function handler({ query: { id } }, res) {
  // const filtered = people.filter((p) => p.id === id)

  // // User with id exists
  // if (filtered.length > 0) {
  //   res.status(200).json(filtered[0])
  // } else {
  //   res.status(404).json({ message: `User with id: ${id} not found.` })
  // }
  res.status(200).json({hello: 'world', id: id});
}