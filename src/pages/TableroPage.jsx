import { Sidebar } from '../components/Sidebar'

// eslint-disable-next-line react/prop-types
export function TableroPage({setUser}) {

  return (
    <div className="flex">
      <Sidebar setUser={setUser}/>
      <div className="w-4/6 mx-auto">
        
        <div className="mt-10 mb-10 font-extrabold text-3xl">
          Tablero Informativo
        </div>

      </div>
    </div>
  )
}
