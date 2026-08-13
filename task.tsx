import { useState } from 'react'
import { useTasks } from './context/TaskContext.jsx'
import { useFilteredTasks } from './hooks/useFilteredTasks.js'
import TaskForm from './components/TaskForm.jsx'
import TaskList from './components/TaskList.jsx'
import FilterBar from './components/FilterBar.jsx'
import StatsBar from './components/StatsBar.jsx'

export default function App() {
  const { tasks, dispatch, stats } = useTasks()
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState('')

  const visibleTasks = useFilteredTasks(tasks, { status, query })

  return (
    <div className="app">
      <header className="app__header">
        <span className="app__eyebrow">Taskflow</span>
        <h1 className="app__title">Clear the current, one task at a time</h1>
      </header>

      <main className="app__panel">
        <TaskForm />
        <StatsBar stats={stats} />
        <FilterBar
          status={status}
          setStatus={setStatus}
          query={query}
          setQuery={setQuery}
          hasCompleted={stats.completed > 0}
          onClearCompleted={() => dispatch({ type: 'CLEAR_COMPLETED' })}
        />
        <TaskList tasks={visibleTasks} />
      </main>

      <footer className="app__footer">
        <p>Double-click a task to rename it. Everything saves locally in your browser.</p>
      </footer>
    </div>
  )
}