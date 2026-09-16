
class TaskStore {
    constructor() {
        // حماية مصفوفة المهام لمنع التعديل المباشر عليها من الخارج
        this.#tasks = [];
    }

    #tasks; // Private field

    // 1. add(title, priority, ownerId)
    add(title, priority, ownerId) {
        if (!title || typeof title !== "string" || title.trim() === "") {
            throw new Error("Invalid title: Title cannot be empty.");
        }
        if (!Number.isInteger(priority) || priority < 1 || priority > 3) {
            throw new Error("Invalid priority: Priority must be an integer between 1 and 3.");
        }

        const newTask = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
            title: title.trim(),
            priority: priority,
            ownerId: ownerId,
            status: "todo"
        };

        this.#tasks.push(newTask);
        return { ...newTask };
    }

    // 2. findById(id)
    findById(id) {
        const task = this.#tasks.find(t => t.id === id);
        return task ? { ...task } : undefined;
    }

    // 3. update(id, changes)
    update(id, changes) {
        const taskIndex = this.#tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) return undefined;

        // منع تعديل الـ id
        const { id: _, ...validChanges } = changes;

        // تحديث الحقول الممررة فقط
        this.#tasks[taskIndex] = {
            ...this.#tasks[taskIndex],
            ...validChanges
        };

        return { ...this.#tasks[taskIndex] };
    }

    // 4. remove(id)
    remove(id) {
        const taskIndex = this.#tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
            this.#tasks.splice(taskIndex, 1);
            return true;
        }
        return false;
    }

    // 5. list(filter)
    list(filter = {}) {
        let result = [...this.#tasks];

        if (filter.status) {
            result = result.filter(t => t.status === filter.status);
        }
        if (filter.ownerId) {
            result = result.filter(t => t.ownerId === filter.ownerId);
        }

        // الترتيب حسب الأولوية للأعلى أولاً (3 ثم 2 ثم 1)
        result.sort((a, b) => b.priority - a.priority);

        // إرجاع نسخة عميقة لعدم إمكانية تعديل المصفوفة أو الأوبجكت من الخارج
        return result.map(t => ({ ...t }));
    }

    // 6. countByStatus()
    countByStatus() {
        const counts = { todo: 0, doing: 0, done: 0 };
        this.#tasks.forEach(t => {
            if (counts.hasOwnProperty(t.status)) {
                counts[t.status]++;
            }
        });
        return counts;
    }
}

// ==========================================
// تجربة الـ Run واختبار جميع المسائل
// ==========================================

const store = new TaskStore();

console.log("--- 1. Testing Add ---");
const task1 = store.add("Study JavaScript", 3, "user_1");
const task2 = store.add("Clean Room", 1, "user_1");
const task3 = store.add("Buy Groceries", 2, "user_2");
console.log("Added:", task1);

console.log("\n--- 2. Testing FindById ---");
console.log("Found:", store.findById(task1.id));
console.log("NotFound:", store.findById("invalid_id"));

console.log("\n--- 3. Testing Update ---");
store.update(task1.id, { status: "doing", id: "HACKED_ID" }); // لن يتغير الـ ID
console.log("`Updated Task 1:", store.findById(task1.id));

console.log("\n--- 4. Testing List & Sort ---");
console.log("Filtered & Sorted (user_1):", store.list({ ownerId: "user_1" }));

console.log("\n--- 5. Testing CountByStatus ---");
console.log("Counts:", store.countByStatus());

console.log("\n--- 6. Testing Remove ---");
console.log("Remove Task 2:", store.remove(task2.id));
console.log("Current Tasks Count:", store.list().length);