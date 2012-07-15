class CreateFavorites < ActiveRecord::Migration
  def change
    create_table :favorites do |t|
      t.integer :user_id
      t.text :text
      t.integer :id
      t.string :link

      t.timestamps
    end
  end
end
