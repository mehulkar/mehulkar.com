class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :name
      t.text :description, :default => "No description given"
      t.string :status
      t.string :demo_url
      t.string :source_url
      t.boolean :public

      t.timestamps
    end
  end
end
